import React from "react";
import image1 from '../../images/200x200.png';
import image2 from '../../images/300x400.png';
import image3 from '../../images/200x600.png';
import image4 from '../../images/400x300.png';
import image5 from '../../images/600x200.png';
import image6 from '../../images/600x200.png';

class Canvas extends React.Component {
  state = {
    isDragging: false,
    context: null
  };

  constructor() {
    super();
    this.canvasRef = React.createRef();
    this.width = 300;
    this.height = 300;
    this.initialDragX = 0;
    this.initialDragY = 0;
    this.currentDragX = 0;
    this.currentDragY = 0;
    this.pageX = 0;
    this.pageY = 0;
  }

  go() {
    this.resetCanvas();
    this.drawImage();
    requestAnimationFrame(this.go.bind(this));
  }

  drawImage() {
    const { context } = this.state;
    console.log(this.pageX - (this.initialDragX - this.currentDragX));
    context.drawImage(
      this.imageObj1,
      (this.pageX - (this.initialDragX - this.currentDragX)) + ((this.width - this.imageObj1.width) / 2),
      ((this.height - this.imageObj1.height) / 2)
    );
  }

  componentDidMount() {
    this.setState({ context: this.canvasRef.current.getContext("2d") });
    let that = this;

    const imageObj1 = new Image()
    imageObj1.src = image1
    imageObj1.onload = function() {
      that.go();
    }
    this.imageObj1 = imageObj1
  }

  handleMouseDown = e => {
    this.initialDragX = e.pageX;
    this.initialDragY = e.pageY;
    this.currentDragX = e.pageX;
    this.currentDragY = e.pageY;
    this.setState({
      isDragging: true
    });
  };

  handleMouseMove = e => {
    const { isDragging } = this.state;
    if (isDragging) {
      this.currentDragX = e.pageX;
      this.currentDragY = e.pageY;
      this.currentX = this.currentX - (this.initialDragX - e.pageX);
    }
  };

  resetCanvas() {
    const { context } = this.state;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, this.width, this.height);
  }

  stopDragging = () => {
    this.pageX = this.pageX - (this.initialDragX - this.currentDragX);
    this.pageY = 0;
    this.initialDragX = this.currentDragX;
    this.initialDragY = this.currentDragY;
  }

  handleMouseOut = e => {
    this.stopDragging();
    this.setState({ isDragging: false });
  };

  handleMouseUp = e => {
    this.stopDragging();
    this.setState({ isDragging: false });
  };


  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.width}
        height={this.height}
        style={{
          border: "1px solid black"
        }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
      />
    );
  }
}

export default Canvas;
