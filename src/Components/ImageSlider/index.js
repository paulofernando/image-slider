import React from "react";
import image1 from '../../images/200x200.png';
import image2 from '../../images/300x400.png';
import image3 from '../../images/200x600.png';
import image4 from '../../images/400x300.png';
import image5 from '../../images/600x200.png';
import image6 from '../../images/600x200.png';

const images = [image1, image2, image3];

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
    this.drawImage();
    requestAnimationFrame(this.go.bind(this));
  }

  drawImage() {
    const { context } = this.state;
    this.pages.forEach(({ image, x }, index) => {
      context.drawImage(
        image,
        (x - (this.initialDragX - this.currentDragX)) + ((this.width - image.width) / 2) + (index * this.width),
        ((this.height - image.height) / 2)
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
      return ({
        x: 0,
        image,
      })
    })
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
    if (isDragging) {
      this.currentDragX = e.pageX;
      this.currentX = this.currentX - (this.initialDragX - e.pageX);
    }
  };

  resetCanvas() {
    const { context } = this.state;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, this.width, this.height);
  }

  stopDragging = () => {
    for (let i = 0; i < this.pages.length; i++) {
      this.pages[i].x -= (this.initialDragX - this.currentDragX);
    }
    this.initialDragX = this.currentDragX;
    this.setState({ isDragging: false });
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
