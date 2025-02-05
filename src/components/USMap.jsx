import React from "react";

const USMap = (percentages, stateInformation) => {
  
  const getStateInformation = (stateID) => {
      const stateInfo = percentages.find(item => item[0] === stateID);
      return stateInfo || null; // Return null if the stateID is not found
  };

  function calculateStateFilter(stateID) {
    const stateInfo = getStateInformation(stateID);

    console.log("Info:");
    console.log(stateInfo);
    
    if (stateInfo == null) {
      return 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)';
    }
    else {
      var redPercent = parseFloat(stateInfo[2][0]).toFixed(2);
      var bluePercent = parseFloat(stateInfo[2][1]).toFixed(2);
      var greenPercent = parseFloat(stateInfo[2][2]).toFixed(2);
      return "hue-rotate(360deg) brightness(40%) saturate(100%)"
      // return 'invert(40%) sepia(50%) saturate(150%) hue-rotate(180deg) brightness(100%) contrast(100%)';
    }
  }

  return (
    <div style={{ position: 'relative', width: '1000px', height: '600px' }}>
      {/* MAYBE: Update left and top for all states so that they align properly */}
      <img src="src/assets/states/Alabama.png" alt="Alabama" style={{ position: 'absolute', left: 'x1px', top: 'y1px', transform: 'scale(0.3)', filter: calculateStateFilter(1) }} />
      <img src="src/assets/states/Alaska.png" alt="Alaska" style={{ position: 'absolute', left: 'x2px', top: 'y2px', transform: 'scale(0.3)', filter: calculateStateFilter(2) }} />
      <img src="src/assets/states/Arizona.png" alt="Arizona" style={{ position: 'absolute', left: 'x3px', top: 'y3px', transform: 'scale(0.3)', filter: calculateStateFilter(3) }} />
      <img src="src/assets/states/Arkansas.png" alt="Arkansas" style={{ position: 'absolute', left: 'x4px', top: 'y4px', transform: 'scale(0.3)', filter: calculateStateFilter(4) }} />
      <img src="src/assets/states/California.png" alt="California" style={{ position: 'absolute', left: 'x5px', top: 'y5px', transform: 'scale(0.3)', filter: calculateStateFilter(5) }} />
      <img src="src/assets/states/Colorado.png" alt="Colorado" style={{ position: 'absolute', left: 'x6px', top: 'y6px', transform: 'scale(0.3)', filter: calculateStateFilter(6) }} />
      <img src="src/assets/states/Conneticut.png" alt="Connecticut" style={{ position: 'absolute', left: 'x7px', top: 'y7px', transform: 'scale(0.3)', filter: calculateStateFilter(7) }} />
      <img src="src/assets/states/Delaware.png" alt="Delaware" style={{ position: 'absolute', left: 'x8px', top: 'y8px', transform: 'scale(0.3)', filter: calculateStateFilter(8) }} />
      <img src="src/assets/states/Florida.png" alt="Florida" style={{ position: 'absolute', left: 'x9px', top: 'y9px', transform: 'scale(0.3)', filter: calculateStateFilter(9) }} />
      <img src="src/assets/states/Georgia.png" alt="Georgia" style={{ position: 'absolute', left: 'x10px', top: 'y10px', transform: 'scale(0.3)', filter: calculateStateFilter(10) }} />
      {/* <img src="src/assets/states/Hawaii.png" alt="Hawaii" style={{ position: 'absolute', left: 'x11px', top: 'y11px', transform: 'scale(0.3)', filter: calculateStateFilter(11) }} />
      <img src="src/assets/states/Idaho.png" alt="Idaho" style={{ position: 'absolute', left: 'x12px', top: 'y12px', transform: 'scale(0.3)', filter: calculateStateFilter(12) }} />
      <img src="src/assets/states/Illinois.png" alt="Illinois" style={{ position: 'absolute', left: 'x13px', top: 'y13px', transform: 'scale(0.3)', filter: calculateStateFilter(13) }} />
      <img src="src/assets/states/Indiana.png" alt="Indiana" style={{ position: 'absolute', left: 'x14px', top: 'y14px', transform: 'scale(0.3)', filter: calculateStateFilter(14) }} />
      <img src="src/assets/states/Iowa.png" alt="Iowa" style={{ position: 'absolute', left: 'x15px', top: 'y15px', transform: 'scale(0.3)', filter: calculateStateFilter(15) }} />
      <img src="src/assets/states/Kansas.png" alt="Kansas" style={{ position: 'absolute', left: 'x16px', top: 'y16px', transform: 'scale(0.3)', filter: calculateStateFilter(16) }} />
      <img src="src/assets/states/Kentucky.png" alt="Kentucky" style={{ position: 'absolute', left: 'x17px', top: 'y17px', transform: 'scale(0.3)', filter: calculateStateFilter(17) }} />
      <img src="src/assets/states/Louisiana.png" alt="Louisiana" style={{ position: 'absolute', left: 'x18px', top: 'y18px', transform: 'scale(0.3)', filter: calculateStateFilter(18) }} />
      <img src="src/assets/states/Maine.png" alt="Maine" style={{ position: 'absolute', left: 'x19px', top: 'y19px', transform: 'scale(0.3)', filter: calculateStateFilter(19) }} />
      <img src="src/assets/states/Maryland.png" alt="Maryland" style={{ position: 'absolute', left: 'x20px', top: 'y20px', transform: 'scale(0.3)', filter: calculateStateFilter(20) }} />
      <img src="src/assets/states/Massachussetts.png" alt="Massachusetts" style={{ position: 'absolute', left: 'x21px', top: 'y21px', transform: 'scale(0.3)', filter: calculateStateFilter(21) }} />
      <img src="src/assets/states/Michigan.png" alt="Michigan" style={{ position: 'absolute', left: 'x22px', top: 'y22px', transform: 'scale(0.3)', filter: calculateStateFilter(22) }} />
      <img src="src/assets/states/Minnesota.png" alt="Minnesota" style={{ position: 'absolute', left: 'x23px', top: 'y23px', transform: 'scale(0.3)', filter: calculateStateFilter(23) }} />
      <img src="src/assets/states/Mississippi.png" alt="Mississippi" style={{ position: 'absolute', left: 'x24px', top: 'y24px', transform: 'scale(0.3)', filter: calculateStateFilter(24) }} />
      <img src="src/assets/states/Missouri.png" alt="Missouri" style={{ position: 'absolute', left: 'x25px', top: 'y25px', transform: 'scale(0.3)', filter: calculateStateFilter(25) }} />
      <img src="src/assets/states/Montana.png" alt="Montana" style={{ position: 'absolute', left: 'x26px', top: 'y26px', transform: 'scale(0.3)', filter: calculateStateFilter(26) }} />
      <img src="src/assets/states/Nebraska.png" alt="Nebraska" style={{ position: 'absolute', left: 'x27px', top: 'y27px', transform: 'scale(0.3)', filter: calculateStateFilter(27) }} />
      <img src="src/assets/states/Nevada.png" alt="Nevada" style={{ position: 'absolute', left: 'x28px', top: 'y28px', transform: 'scale(0.3)', filter: calculateStateFilter(28) }} />
      <img src="src/assets/states/New Hampshire.png" alt="New Hampshire" style={{ position: 'absolute', left: 'x29px', top: 'y29px', transform: 'scale(0.3)', filter: calculateStateFilter(29) }} />
      <img src="src/assets/states/New Jersey.png" alt="New Jersey" style={{ position: 'absolute', left: 'x30px', top: 'y30px', transform: 'scale(0.3)', filter: calculateStateFilter(30) }} />
      <img src="src/assets/states/New Maxico.png" alt="New Mexico" style={{ position: 'absolute', left: 'x31px', top: 'y31px', transform: 'scale(0.3)', filter: calculateStateFilter(31) }} />
      <img src="src/assets/states/New York.png" alt="New York" style={{ position: 'absolute', left: 'x32px', top: 'y32px', transform: 'scale(0.3)', filter: calculateStateFilter(32) }} />
      <img src="src/assets/states/North Carolina.png" alt="North Carolina" style={{ position: 'absolute', left: 'x33px', top: 'y33px', transform: 'scale(0.3)', filter: calculateStateFilter(33) }} />
      <img src="src/assets/states/North Dakota.png" alt="North Dakota" style={{ position: 'absolute', left: 'x34px', top: 'y34px', transform: 'scale(0.3)', filter: calculateStateFilter(34) }} />
      <img src="src/assets/states/Ohio.png" alt="Ohio" style={{ position: 'absolute', left: 'x35px', top: 'y35px', transform: 'scale(0.3)', filter: calculateStateFilter(35) }} />
      <img src="src/assets/states/Oklahoma.png" alt="Oklahoma" style={{ position: 'absolute', left: 'x36px', top: 'y36px', transform: 'scale(0.3)', filter: calculateStateFilter(36) }} />
      <img src="src/assets/states/Oregon.png" alt="Oregon" style={{ position: 'absolute', left: 'x37px', top: 'y37px', transform: 'scale(0.3)', filter: calculateStateFilter(37) }} />
      <img src="src/assets/states/Pennsylvania.png" alt="Pennsylvania" style={{ position: 'absolute', left: 'x38px', top: 'y38px', transform: 'scale(0.3)', filter: calculateStateFilter(38) }} />
      <img src="src/assets/states/Rhode Island.png" alt="Rhode Island" style={{ position: 'absolute', left: 'x39px', top: 'y39px', transform: 'scale(0.3)', filter: calculateStateFilter(39) }} />
      <img src="src/assets/states/South Carolina.png" alt="South Carolina" style={{ position: 'absolute', left: 'x40px', top: 'y40px', transform: 'scale(0.3)', filter: calculateStateFilter(40) }} />
      <img src="src/assets/states/South Dakota.png" alt="South Dakota" style={{ position: 'absolute', left: 'x41px', top: 'y41px', transform: 'scale(0.3)', filter: calculateStateFilter(41) }} />
      <img src="src/assets/states/Tennessee.png" alt="Tennessee" style={{ position: 'absolute', left: 'x42px', top: 'y42px', transform: 'scale(0.3)', filter: calculateStateFilter(42) }} />
      <img src="src/assets/states/Texas.png" alt="Texas" style={{ position: 'absolute', left: 'x43px', top: 'y43px', transform: 'scale(0.3)', filter: calculateStateFilter(43) }} />
      <img src="src/assets/states/Utah.png" alt="Utah" style={{ position: 'absolute', left: 'x44px', top: 'y44px', transform: 'scale(0.3)', filter: calculateStateFilter(44) }} />
      <img src="src/assets/states/Vermont.png" alt="Vermont" style={{ position: 'absolute', left: 'x45px', top: 'y45px', transform: 'scale(0.3)', filter: calculateStateFilter(45) }} />
      <img src="src/assets/states/Virginia.png" alt="Virginia" style={{ position: 'absolute', left: 'x46px', top: 'y46px', transform: 'scale(0.3)', filter: calculateStateFilter(46) }} />
      <img src="src/assets/states/Washington.png" alt="Washington" style={{ position: 'absolute', left: 'x47px', top: 'y47px', transform: 'scale(0.3)', filter: calculateStateFilter(47) }} />
      <img src="src/assets/states/West Virginia.png" alt="West Virginia" style={{ position: 'absolute', left: 'x48px', top: 'y48px', transform: 'scale(0.3)', filter: calculateStateFilter(48) }} />
      <img src="src/assets/states/Wisconsin.png" alt="Wisconsin" style={{ position: 'absolute', left: 'x49px', top: 'y49px', transform: 'scale(0.3)', filter: calculateStateFilter(49) }} />
      <img src="src/assets/states/Wyoming.png" alt="Wyoming" style={{ position: 'absolute', left: 'x50px', top: 'y50px', transform: 'scale(0.3)', filter: calculateStateFilter(50) }} /> */}
    </div>
  );
};

export default USMap;