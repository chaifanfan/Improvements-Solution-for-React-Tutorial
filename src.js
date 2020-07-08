function Square(props) {
     return (
       <button className="square" onClick={props.onClick} style={props.isBold ? {color:'red'} : {}}>
         {props.value}
       </button>
     )
}

class Board extends React.Component {
  renderSquare(i) {
    let isBold = false
    if (this.props.winner.indexOf(i) !== -1) {
      isBold = true
    }
    return (
      <Square key={i} isBold={isBold}
        value={this.props.squares[i]} 
        onClick={()=>this.props.onClick(i)} />
      )
  }

  render() {
    let renderSquares = []
    for (let i = 0; i < 3; i++) {
      let rows = []
      for (let j = 0; j < 3; j++) {
        rows.push(this.renderSquare(i*3+j))
      }
      renderSquares.push(<div key={i} className="board-row">{rows}</div>)
    }
    
    return (
      <div>
        {renderSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    }
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  
  handleOrderClick() {
    this.setState({
      isAsc: !this.state.isAsc,
    })
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    })
  }
  
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares).winner

    const moves = history.map((step, move)=>{
      const row = Math.floor(step.position/3)
      const col = step.position%3
      const desc = move ? ('Go to move #' + move + `{ (${col},${row}}`) : 'Go to game start'
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}
            style={this.state.stepNumber === move ? {fontWeight:'bold'} : {}}>{desc}</button>
        </li>
      )
    })
    
    this.state.isAsc ? moves : moves.reverse()
    
    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else if (this.state.stepNumber === 9) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board winner={calculateWinner(current.squares).lines}
            squares={current.squares} 
            onClick={(i)=>this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.handleOrderClick()}>{this.state.isAsc ? 'Desc' : 'Asc'}</button>
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i]
      }
    }
  }
  // if (squares.length === 9) {
  //   return {
  //     winner: '',
  //     lines: '',
  //     isDraw: 'Draw',
  //   }
  // }
  return {
    winner: '',
    lines: ''
  }
}
