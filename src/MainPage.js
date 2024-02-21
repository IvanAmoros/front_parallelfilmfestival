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
      <h1>Ivan Amorós</h1>
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
      ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
      fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
      mollit anim id est laborum.
      </p>
      <p onClick={handleLinkedInClick} style={{ cursor: 'pointer' }}>
				<img src={`${process.env.PUBLIC_URL}/images/LinkedIn_icon.png`} alt="LinkedIn Icon" style={{ marginRight: '5px', width: '20px', height: '20px' }}/>
        <span className="underline-on-hover">Ivan Amorós Prados</span>
      </p>
    </div>
  );
}

export default MainPage;
