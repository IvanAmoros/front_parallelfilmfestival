import React from 'react';

function MainPage() {
  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/ivan-amoros-prados/', '_blank');
  };

  React.useEffect(() => {
    document.title = "Ivan Amorós";
  }, []);

  return (
    <div>
      <h1>UNDER CONSTRUCTION</h1>
      <p onClick={handleLinkedInClick} style={{ cursor: 'pointer' }}>
				<img src={`${process.env.PUBLIC_URL}/images/LinkedIn_icon.png`} alt="LinkedIn Icon" style={{ marginRight: '5px', width: '20px', height: '20px' }}/>
        <span className="underline-on-hover">Ivan Amorós Prados</span>
      </p>
    </div>
  );
}

export default MainPage;
