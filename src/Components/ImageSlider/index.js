import React from "react";
import image1 from '../../images/200x200.png';
import image2 from '../../images/300x400.png';
import image3 from '../../images/200x600.png';
import image4 from '../../images/400x300.png';
import image5 from '../../images/600x200.png';
import image6 from '../../images/300x300.png';

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
  }

  go() {
    this.resetCanvas();
    this.scaleToFitAndDrawImage();
  }

  scaleToFitAndDrawImage() {
    const { context } = this.state;
    this.pages.forEach(({ image, x, scale }, index) => {
      context.drawImage(
        image,
        (x - (this.initialDragX - this.currentDragX)) + ((this.width / 2) - (image.width / 2) * scale),
        ((this.height - (image.height * scale)) / 2),
        image.width * scale, image.height * scale
      );
    })
  }

  componentDidMount() {
    this.setState({ context: this.canvasRef.current.getContext("2d") });
    let that = this;

    let currentPageX = 0;
    this.pages = images.map((img) => {
      const image = new Image();
      image.src = img;
      image.onload = function() {
        that.go();
      }

      const page = {
        x: currentPageX,
        image,
        scale: Math.min(this.width / image.width, this.height / image.height),
      }

      currentPageX += this.width;
      return page;
    })
  }

  insideBoundaries = () => {
    const firstPage = this.pages[0];
    const lastPage = this.pages[this.pages.length - 1];
    const isLeftBoundaryValid = firstPage.x - (this.initialDragX - this.currentDragX) <= 0;
    const isRightBoundaryValid = lastPage.x + this.width - (this.initialDragX - this.currentDragX) >= this.width;

    return (isLeftBoundaryValid && isRightBoundaryValid)
  }

  handleMouseDown = e => {
    this.initialDragX = e.pageX;
    this.currentDragX = e.pageX;
    this.setState({
      isDragging: true
    });
  };

  handleMouseMove = e => {
    const { isDragging } = this.state;
    if (isDragging && (this.insideBoundaries())) {
      this.currentDragX = e.pageX;
    }
    requestAnimationFrame(this.go.bind(this));
  };

  stopDragging = () => {
    if (this.insideBoundaries()) {
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].x -= (this.initialDragX - this.currentDragX);
      }
      this.initialDragX = this.currentDragX;
    }
    this.setState({ isDragging: false });
  }

  resetCanvas() {
    const { context } = this.state;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, this.width, this.height);
  }

  handleMouseOut = e => {
    this.stopDragging();
  };

  handleMouseUp = e => {
    this.stopDragging();
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

export default ImageSlider;
