import React from 'react';
import PropTypes from 'prop-types';

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
    this.pages = images.map((img) => (this.createPage(img)));
  }

  createPage = (img) => {
    const { width, height } = this.props;
    const image = new Image();
    image.src = img;
    image.onload = () => this.go();
    return {
      image,
      scale: Math.min(width / image.width, height / image.height),
    };
  }

  isLeftBoundaryValid = () => this.firstPageX - (this.offset) <= 0;

  isRightBoundaryValid = () => {
    const { width } = this.props;
    const lastPageX = this.firstPageX + ((this.pages.length - 1) * width);
    return lastPageX + width - (this.offset) >= width;
  }

  handleMouseDown = (e) => {
    this.initialDragX = e.pageX;
    this.currentDragX = e.pageX;
    this.setState({ isDragging: true });
  }

  isMovingToTheLeft = (currentX) => currentX - this.oldX > 0

  isMovingToTheRight = (currentX) => currentX - this.oldX < 0

  handleMouseMove = (e) => {
    const { isDragging } = this.state;
    if (isDragging) {
      if ((this.isLeftBoundaryValid() && this.isMovingToTheLeft(e.pageX))
          || (this.isRightBoundaryValid() && this.isMovingToTheRight(e.pageX))) {
        this.currentDragX = e.pageX;
      }
      requestAnimationFrame(this.go.bind(this));
    }
    this.oldX = e.pageX;
  };

  stopDragging = () => {
    this.firstPageX = this.calculateXWithOffset(this.offset);
    this.initialDragX = this.currentDragX;
    this.setState({ isDragging: false });
  }

  handleMouseOut = () => {
    this.stopDragging();
  };

  handleMouseUp = () => {
    this.stopDragging();
  };

  calculateXWithOffset = () => { // control boundaries
    const { width } = this.props;
    if (this.firstPageX - this.offset > 0) {
      return 0; // return max value for first page left
    }

    if (this.firstPageX - this.offset < (width * (this.pages.length - 1) * -1)) {
      return (width * (this.pages.length - 1) * -1); // return min value for last page right
    }

    return this.firstPageX - this.offset;
  }

  scaleToFitAndDrawImage() {
    const { context } = this.state;
    const { width, height } = this.props;
    this.offset = this.initialDragX - this.currentDragX;
    const x = this.calculateXWithOffset(this.offset);
    this.pages.forEach(({ image, scale }, index) => {
      context.drawImage(
        image,
        (x + (width * index)) + ((width / 2) - (image.width / 2) * scale),
        ((height - (image.height * scale)) / 2),
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
    const { width, height } = this.props;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        width={width}
        height={height}
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

ImageSlider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

ImageSlider.defaultProps = {
  width: 300,
  height: 300,
};

export default ImageSlider;
