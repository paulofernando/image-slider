import React from 'react';
import PropTypes from 'prop-types';

const pagesToPaint = 5;

class ImageSlider extends React.Component {
  state = {
    isDragging: false,
    context: null,
    currentPage: 0,
  };

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.initialDragX = 0;
    this.currentDragX = 0;
    this.firstPageX = 0;
    this.offset = 0;
    this.oldX = 0; // used to control movement direction
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
      { once: false },
    );

    document.addEventListener(
      'mouseup',
      (e) => {
        this.handleMouseUp(e);
      },
      { once: false },
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
    const { width } = this.props;
    this.firstPageX = this.calculateXWithOffset(this.offset);
    this.initialDragX = this.currentDragX;
    this.setState({
      isDragging: false,
      currentPage: (this.currentDragX === 0 ? 0 : Math.round(Math.abs(this.firstPageX) / width)),
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
    const { context, currentPage } = this.state;
    const { width, height, showPageBorders } = this.props;

    this.offset = this.initialDragX - this.currentDragX;
    const x = this.calculateXWithOffset(this.offset);
    this.pages.forEach(({ image, scale }, index) => {
      // just paint current page and the adjacent
      if (currentPage - index >= (Math.floor(pagesToPaint / 2) * -1) &&
          currentPage - index <= Math.floor(pagesToPaint / 2)) {
        context.drawImage(
          image,
          (x + (width * index)) + ((width / 2) - (image.width / 2) * scale),
          ((height - (image.height * scale)) / 2),
          image.width * scale,
          image.height * scale, // TODO scale is breaking first paint
        );

        if (showPageBorders) {
          context.beginPath();
          context.strokeStyle = '#ccc';
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
    const { width, height } = this.props;
    context.fillStyle = '#eee';
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
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  showPageBorders: PropTypes.bool,
};

ImageSlider.defaultProps = {
  width: 300,
  height: 300,
  showPageBorders: false,
};

export default ImageSlider;
