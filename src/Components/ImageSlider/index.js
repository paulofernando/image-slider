import React from 'react';
import image1 from '../../images/200x200.png';
import image2 from '../../images/300x400.png';
import image5 from '../../images/600x200.png';

const images = [image1, image2, image5];

class ImageSlider extends React.Component {
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
    this.currentDragX = 0;
    this.firstPageX = 0;
    this.offset = 0;
    this.oldX = 0;
  }

  go() {
    this.resetCanvas();
    this.scaleToFitAndDrawImage();
  }

  scaleToFitAndDrawImage() {
    const { context } = this.state;
    this.offset = this.initialDragX - this.currentDragX;
    this.pages.forEach(({ image, scale }, index) => {
      context.drawImage(
        image,
        (this.firstPageX + (this.width * index) - (this.offset)) + ((this.width / 2) - (image.width / 2) * scale),
        ((this.height - (image.height * scale)) / 2),
        image.width * scale, image.height * scale
      );
    })
  }

  componentDidMount() {
    this.setState({ context: this.canvasRef.current.getContext("2d") });
    let that = this;

    this.pages = images.map((img) => {
      const image = new Image();
      image.src = img;
      image.onload = function() {
        that.go();
      }

      return {
        image,
        scale: Math.min(this.width / image.width, this.height / image.height),
      };
    })
  }

  isLeftBoundaryValid = () => {
    return this.firstPageX - (this.offset) <= 0;
  }

  isRightBoundaryValid = () => {
    const lastPageX = this.firstPageX + (this.pages.length * this.width);
    return lastPageX + this.width - (this.offset) >= this.width;
  }

  insideBoundaries = () => {
    return (this.isLeftBoundaryValid() && this.isRightBoundaryValid())
  }

  handleMouseDown = e => {
    this.initialDragX = e.pageX;
    this.currentDragX = e.pageX;
    this.setState({
      isDragging: true
    });
  };

  isMovingToTheLeft = (currentX) => {
    return currentX - this.oldX > 0;
  }

  isMovingToTheRight = (currentX) => {
    return currentX - this.oldX < 0;
  }

  handleMouseMove = e => {
    const { isDragging } = this.state;
    if (isDragging) {
      if (this.insideBoundaries() || (this.isLeftBoundaryValid() && this.isMovingToTheLeft(e.pageX))
          || (this.isRightBoundaryValid() && this.isMovingToTheRight(e.pageX))){
        this.currentDragX = e.pageX;
        requestAnimationFrame(this.go.bind(this));
      }
    }
    this.oldX = e.pageX;
  };


  stopDragging = () => {
    if (this.insideBoundaries()) {
      this.firstPageX -= this.offset;
      this.initialDragX = this.currentDragX;
    }
    this.setState({ isDragging: false });
  }

  handleMouseOut = e => {
    this.stopDragging();
  };

  handleMouseUp = e => {
    this.stopDragging();
  };

  resetCanvas() {
    const { context } = this.state;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, this.width, this.height);
  }

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

export default ImageSlider;
