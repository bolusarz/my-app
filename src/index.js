import React from "react";
import ReactDOM from "react-dom";
import './index.css';

// Controlled component
function Square(props) {
      const value = props.highlight ? 
        <span className="highlight">{props.value}</span> : props.value;
      return (
        <button className="square" onClick={props.onClick}>
          {value}
        </button>
      );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={this.props.winner.includes(i)}
            />
      );
    }
  
    render() {
      const rows = [];
      for (let i = 0; i < 3; i++) {
          const cols = [];
          for (let j = 0; j < 3; j++) {
              cols.push(this.renderSquare(i * 3 + j))
          }
          rows.push(<div key={i} className="board-row">{cols}</div>)
      }  
      return (
        <div>{rows}</div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            historyClicked: false,
            stepNumber: 0,
            position: [],
            sortMovesAsc: true,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const row = Math.floor(i / 3);
        const column = i % 3;
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            historyClicked: false,
            position: this.state.position.concat([column + ',' + row])
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            historyClicked: true,
        })
    }

    toggleSortOrder() {
        this.setState({
            sortMovesAsc: !this.state.sortMovesAsc
        })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const desc = move ? 'Go to move #' + move + '(' + this.state.position[move-1] + ')' : 'Go to game start';
          
          return (
              <li key={move}>
                  <button 
                    onClick={() => this.jumpTo(move)}
                    style={this.state.historyClicked && this.state.stepNumber === move ? { fontWeight: 'bold' } : {fontWeight: 'normal'}}>
                    {desc}
                  </button>
              </li>
          )
      })

      if (this.state.sortMovesAsc) {
          moves.reverse();
      }

      let status;
      if (winner) {
          status = "Winner: " + winner.winner;
      } else if (this.state.stepNumber === 9 && !winner) {
          status = "Draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
      }
      const sortMoves = this.state.sortMovesAsc ? 'Sort moves descending' : 'Sort moves ascending';
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares = {current.squares}
                winner = {winner ? winner.line : []}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={ () => this.toggleSortOrder()}>{sortMoves}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], line: lines[i]};
      }
    }
    return null;
  }
  