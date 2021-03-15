import React from 'react';
import image1 from '../../images/200x200.png';
import image2 from '../../images/300x400.png';
import image5 from '../../images/600x200.png';

const images = [image1, image2, image5];

class ImageSlider extends React.Component {
  state = {
    isDragging: false,
    context: null,
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
    this.oldX = 0; // used to control movement direction
  }

  componentDidMount() {
    this.setState({ context: this.canvasRef.current.getContext('2d') }, () => {
      this.go();
    });

    const that = this;

    this.pages = images.map((img) => {
      const image = new Image();
      image.src = img;
      image.onload = () => that.go();
      return {
        image,
        scale: Math.min(this.width / image.width, this.height / image.height),
      };
    });
  }

  isLeftBoundaryValid = () => this.firstPageX - (this.offset) <= 0;

  isRightBoundaryValid = () => {
    const lastPageX = this.firstPageX + ((this.pages.length - 1) * this.width);
    return lastPageX + this.width - (this.offset) >= this.width;
  }

  insideBoundaries = () => (this.isLeftBoundaryValid() && this.isRightBoundaryValid());

  handleMouseDown = (e) => {
    this.initialDragX = e.pageX;
    this.currentDragX = e.pageX;
    this.setState({
      isDragging: true,
    });
  }

  isMovingToTheLeft = (currentX) => currentX - this.oldX > 0

  isMovingToTheRight = (currentX) => currentX - this.oldX < 0

  handleMouseMove = (e) => {
    const { isDragging } = this.state;
    if (isDragging) {
      if (this.insideBoundaries()
          || (this.isLeftBoundaryValid() && this.isMovingToTheLeft(e.pageX))
          || (this.isRightBoundaryValid() && this.isMovingToTheRight(e.pageX))) {
        this.currentDragX = e.pageX;
        requestAnimationFrame(this.go.bind(this));
      }
    }
    this.oldX = e.pageX;
  };

  stopDragging = () => {
    this.firstPageX = this.calculateXWithOffset(this.offset);
    this.initialDragX = this.currentDragX;
    this.setState({ isDragging: false });
  }

  handleMouseOut = (e) => {
    this.stopDragging();
  };

  handleMouseUp = (e) => {
    this.stopDragging();
  };

  calculateXWithOffset = () => {
    if (this.firstPageX - this.offset > 0) {
      return 0; // return max value for first page left
    }

    if (this.firstPageX - this.offset < (this.width * (this.pages.length - 1) * -1)) {
      return (this.width * (this.pages.length - 1) * -1); // return min value for last page right
    }

    return this.firstPageX - this.offset;
  }

  scaleToFitAndDrawImage() {
    const { context } = this.state;
    this.offset = this.initialDragX - this.currentDragX;
    const x = this.calculateXWithOffset(this.offset);
    this.pages.forEach(({ image, scale }, index) => {
      context.drawImage(
        image,
        (x + (this.width * index)) + ((this.width / 2) - (image.width / 2) * scale),
        ((this.height - (image.height * scale)) / 2),
        image.width * scale, image.height * scale,
      );
    });
  }

  go() {
    this.resetCanvas();
    this.scaleToFitAndDrawImage();
  }

  resetCanvas() {
    const { context } = this.state;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, this.width, this.height);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.width}
        height={this.height}
        className="image-slider"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
      />
    );
  }
}

export default ImageSlider;
