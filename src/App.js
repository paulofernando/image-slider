import React from 'react';

import ImageSlider from './Components/ImageSlider';
import image1 from './images/200x200.png';
import image2 from './images/300x400.png';
import image3 from './images/400x300.png';
import image4 from './images/600x200.png';
import image5 from './images/200x600.png';
import image6 from './images/300x300.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Publitas Frontend Code Challenge</h1>
      </header>
      <section id="slider-container">
        <ImageSlider
          width={640}
          height={400}
          images={[image1, image2, image3, image4, image5, image6]}
          showPageBorders
        />
        <aside>Drag to change image</aside>
      </section>
      <section id="description">
        Developer: Paulo Fernando
        <br />
        Code:
        {' '}
        <a href="https://github.com/paulofernando/image-slider" target="_blank" rel="noreferrer">
          Github
        </a>
      </section>
    </div>
  );
}

export default App;
