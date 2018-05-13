import React from 'react';
import './App.css';
import styled from 'styled-components';

const Button = styled.button`
  color: ${props => props.win ? 'palevioletred' : 'black'};
`;

function Square(props) {
    return (
        <Button win = {props.win} className="square" onClick={props.onClick}>
            {props.value}
        </Button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let win = false;
        if (this.props.winnersline.length) {
            if (this.props.winnersline.includes(i)) {
                win = true;
            }
        }

        return (
            <Square key = {i}
                    win = {win}
                    value = {this.props.squares[i]}
                    onClick = {() => this.props.onClick(i)}
            />
        );
    }

    renderRaw(i) {
        let row = [];
        for (let j = i*3; j < i*3 + 3; j++) {
            row.push(this.renderSquare(j));
        }
        return (<div key={i} className="board-row">{row}</div>);
    }


    render() {
        let board = [];
        for (let j = 0; j < 3; j++) {
            board.push(this.renderRaw(j));
        }
        return (<div>{board}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            isToggleOn: true,
            colrows: [''],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const colrowscurr = this.state.colrows;
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        let row = Math.floor(i / 3) + 1;
        let col = (i % 3) + 1;
        let colrow = 'coordinate ('+col+','+row+')';
        colrowscurr.push(colrow);
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            colrows: colrowscurr,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    revertList() {
        this.setState({
            isToggleOn: !this.state.isToggleOn,
        });
    }

    render() {
        const history = this.state.history;
        const colrows = this.state.colrows;
        const stepBold = this.state.stepNumber;
        const isToggleOn = this.state.isToggleOn;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const clName = (move === stepBold) ? 'bold' : 'notBold';
            const desc = move ?
                'Go to move #' + move + ' ' + colrows[move]:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={clName}>{desc}</button>
                </li>
            );
        });

        let status, winnersline;
        if (winner) {
            status = "Winner: " + winner.win;
            winnersline = winner.winline
        } else if (winner !== false){
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
            winnersline = [];
        } else {
            status = "It is draw";
            winnersline = [];
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnersline={winnersline}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.revertList()}>
                        {isToggleOn ? 'ASC' : 'DESC'}
                    </button>
                    <div>{status}</div>
                    <ol>{isToggleOn ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    console.log(squares);
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                win: squares[a],
                winline: lines[i]
            };
        } else if (!squares.includes(null)) {
            return false;
        }
    }
    return null;
}

export default Game;
