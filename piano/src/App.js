import React, {Component} from 'react';
import './App.css';
import config from './config';

class App extends Component {
    constructor(props) {
        super(props);
        this.index = -1;
        this.state = {
            hoverIndex: '',
            downIndex: '',
            upIndex: ''
        }
    }
    onMouseEnter = (index) => {
        this.setState({hoverIndex: index})
    };
    onMouseDown = (index, il) => {
        let src = il.url;
        let audio = new Audio(src);
        audio.play();
        this.setState({downIndex: index});
    };
    onMouseUp = (index) => {
        this.setState({upIndex: index})
    };
    componentDidMount() {
        document.addEventListener("keydown", this.onKeyDown)
    }
    onKeyDown = (e) => {
        config.map((il, i) => {
           if(e.key === il.key){
               this.onMouseDown(i,il);
           }
        });
    };
    render() {
        let percent = [2.8, 5.6, 11, 13.7, 16.4, 21.8, 24.6, 30, 32.7, 35.5, 40.8, 43.6, 49, 51.6, 54.4, 59.8, 62.5, 68, 70.7, 73.4, 78.8, 81.5, 87, 89.6, 92.3];
        return (
            <div className="App">
                <ul className="all">
                    {config.map((il, i) => {
                        if (il.type === 'white') {
                            return <li id={il.id} key={il.key}
                                       className={this.state.downIndex === i && this.state.upIndex !== i ? 'white clickStyle' : 'white'}
                                       onMouseEnter={this.onMouseEnter.bind(this, i)}
                                       onMouseDown={this.onMouseDown.bind(this, i, il)}
                                       onMouseUp={this.onMouseUp.bind(this, i)}
                            >{il.key}/{il.name}</li>
                        } else {
                            this.index++;
                            return <li style={{left: percent[this.index] + '%'}} id={il.id} key={il.key}
                                       className={this.state.downIndex === i && this.state.upIndex !== i ? 'black clickStyle' : 'black'}
                                       onMouseEnter={this.onMouseEnter.bind(this, i)}
                                       onMouseDown={this.onMouseDown.bind(this, i, il)}
                                       onMouseUp={this.onMouseUp.bind(this, i)}
                            >{il.name}</li>
                        }
                    })}
                </ul>
            </div>
        );
    }
}

export default App;
