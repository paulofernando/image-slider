import React from 'react';
import PropTypes from 'prop-types';

class ImageSlider extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.initialDragX = 0;
    this.currentDragX = 0;
    this.firstPageX = 0;
    this.offset = 0;
    this.oldX = 0; // used to control movement direction
    this.currentPage = 0;

    this.state = {
      isDragging: false,
      context: null,
    };
  }

  componentDidMount() {
    const { images } = this.props;
    this.setState({ context: this.canvasRef.current.getContext('2d') });
    this.pages = images.map((img) => (this.createPage(img)));

    document.addEventListener(
      'mousemove',
      (e) => {
        this.handleMouseMove(e);
      },
    );

    document.addEventListener(
      'mouseup',
      (e) => {
        this.handleMouseUp(e);
      },
    );
  }

  createPage = (img) => {
    const { width, height } = this.props;
    const image = new Image();
    const that = this;
    image.onload = function () {
      that.go();
    };
    image.src = img;
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
    const { width } = this.props;
    if (isDragging) {
      if ((this.isLeftBoundaryValid() && this.isMovingToTheLeft(e.pageX))
          || (this.isRightBoundaryValid() && this.isMovingToTheRight(e.pageX))) {
        this.currentDragX = e.pageX;
      }
      requestAnimationFrame(this.go.bind(this));
      this.currentPage = Math.round(Math.abs(this.firstPageX) / width);
    }
    this.oldX = e.pageX;
  };

  stopDragging = () => {
    this.firstPageX = this.calculateXWithOffset(this.offset);
    this.initialDragX = this.currentDragX;
    this.setState({
      isDragging: false,
    });
  }

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
    const {
      width,
      height,
      showPageBorders,
      pageBorderColor,
      pagesToPaint,
    } = this.props;

    this.offset = this.initialDragX - this.currentDragX;
    const x = this.calculateXWithOffset(this.offset);
    this.pages.forEach(({ image, scale }, index) => {
      // just paint current page and the adjacent
      if (this.currentPage - index >= (Math.floor(pagesToPaint / 2) * -1)
          && this.currentPage - index <= Math.floor(pagesToPaint / 2)) {
        context.drawImage(
          image,
          (x + (width * index)) + ((width / 2) - (image.width / 2) * scale),
          ((height - (image.height * scale)) / 2),
          image.width * scale,
          image.height * scale, // TODO scale is breaking first paint
        );

        if (showPageBorders) {
          context.beginPath();
          context.strokeStyle = pageBorderColor;
          context.lineWidth = 1;
          context.strokeRect(x + (width * index), 0, width, height);
        }
      }
    });
  }

  go() {
    this.resetCanvas();
    this.scaleToFitAndDrawImage();
  }

  resetCanvas() {
    const { context } = this.state;
    const { width, height, backgroundColor } = this.props;
    context.fillStyle = backgroundColor;
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
      />
    );
  }
}

ImageSlider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  showPageBorders: PropTypes.bool,
  backgroundColor: PropTypes.string,
  pageBorderColor: PropTypes.string,
  pagesToPaint: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ImageSlider.defaultProps = {
  width: 300,
  height: 300,
  showPageBorders: false,
  backgroundColor: '#eee',
  pageBorderColor: '#ccc',
  pagesToPaint: 11, // pages that will be painted (current, 5 on the left, 5 on the right)
};

export default ImageSlider;
