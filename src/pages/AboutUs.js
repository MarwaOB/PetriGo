import React from 'react';
import './AboutUs.css';
import im1 from '../logo/beauty.jpg';
import iman  from '../assets/TeamPictures/Iman.jpg';
import lyna from '../assets/TeamPictures/lyna.jpg';
import Rayan from '../assets/TeamPictures/Rayan.jpg';
import maroua from '../assets/TeamPictures/maroua.jpg';



const Body = () => {
  return (
    <div className="bodyy">
<div className="container">
<div className="containerligne">


<div className="profil">
<img src={maroua} />
<h3>OGAB MAROUA </h3>
<p>2CP-ESI </p>
<p>mm_ogab@esi.dz</p>
</div>

<div className="profil">
<img src={lyna} />
<h3>TICEMBAL LYNA </h3>
<p>2CP-ESI </p>
<p>ml_ticembal@esi.dz </p>
</div>

<div className="profil">
<img src={Rayan} />
<h3>SMARA RAYAN RAHMET EL RAHMAN </h3>
<p>2CP-ESI </p>
<p>mr_smara@esi.dz</p>
</div>
</div>

<div className="containerligne">
<div className="profil">
<img src={iman} />
<h3>EL BAR NOUR EL IMANE</h3>
<p>2CP-ESI </p>
<p>mn_elbar@esi.dz</p>
</div>

<div className="profil">
<img src={im1} />
<h3>CHAKER CHOUROUK</h3>
<p>2CP-ESI </p>
<p>mc_chaker@esi.dz</p>
</div>

<div className="profil">
<img src={im1} />
<h3>MEZDOUR INES</h3>
<p>2CP-ESI </p>
<p>mh_mezdour@esi.dz</p>
</div>
</div>


<div className="footer">
<p>All rights reserved &copy; 2024</p>
</div>

</div>
    </div>
  );
};

export default Body;
