import React from 'react';

import './App.css';
import ImageSlider from './Components/ImageSlider';
import image1 from './images/200x200.png';
import image2 from './images/300x400.png';
import image3 from './images/400x300.png';
import image4 from './images/600x200.png';
import image5 from './images/200x600.png';
import image6 from './images/300x300.png';

function App() {
  return (
    <div className="App">
      <ImageSlider
        width={400}
        height={300}
        images={[image1, image2, image3, image4, image5, image6]}
        showPageBorders
      />
    </div>
  );
}

export default App;
