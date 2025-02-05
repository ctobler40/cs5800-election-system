import React, { useEffect, useState } from 'react';
import '../App.css';


function ContactUs() {
    // useEffect(() => {
    //   
    //     document.body.classList.add('no-background');
    
    //    
    //     return () => {
    //       document.body.classList.remove('no-background');
    //     };
    //   }, []);


  return (
    <div className="footer-body">
        <h1><br />Contact Us</h1>

        <h2>General Inquiries</h2>
        <p>
            contact-us@uiowa.edu
        </p>
        <h2>More Information on Making a Gift to Us</h2>
        <p>
            give-us@uiowa.edu
        </p><h2>Legal Inquiries</h2>
        <p>
            legal@uiowa.edu
        </p>
        <h2>Media Inquiries</h2>
        <p>
            media@uiowa.edu
        
        </p>
        
        
    </div>
  );
};

export default ContactUs;