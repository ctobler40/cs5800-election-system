import React, { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
      <div className='footer'>
          <section className='footer-info'>
              <div className='footer-container'>
                  <div className='footer-links'>
                      <ul className='footer-menu'>
                          <li className='footer-item'>
                              <Link to='/terms' className='footer-links'>
                                  Terms of Service
                              </Link>
                          </li>
                          <li className='footer-item'>
                              <Link to='/privacy' className='footer-links'>
                                  Privacy Policy
                              </Link>
                          </li>
                          <li className='footer-item'>
                              <Link to='/contactUs' className='footer-links'>
                                  Contact Us
                              </Link>
                          </li>
                      </ul>
                  </div>
                  <div className='footer-copyright'>
                      © 2024 Elections. All rights reserved.
                  </div>
              </div>
          </section>
      </div>
  );
  }
  
  export default Footer;