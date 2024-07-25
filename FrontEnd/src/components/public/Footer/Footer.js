import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.socialMedia}>
            <FaFacebook size={30} />
            <FaInstagram size={30} />
            <FaTwitter size={30} />
            <FaYoutube size={30} />
        </div>
        <div className={styles.footerLinks}>
            <div>
                <a href="#">Audio Description</a>
                <a href="#">Investor Relations</a>
                <a href="#">Legal Notices</a>
            </div>
            <div>
                <a href="#">Help Center</a>
                <a href="#">Jobs</a>
                <a href="#">Cookie Preferences</a>
            </div>
            <div>
                <a href="#">Gift Cards</a>
                <a href="#">Terms of Use</a>
                <a href="#">Corporate Information</a>
            </div>
            <div>
                <a href="#">Media Center</a>
                <a href="#">Privacy</a>
                <a href="#">Contact Us</a>
            </div>
        </div>
        <div className={styles.serviceCode}>Service Code</div>
        <div className={styles.copyright}>
          Copyright &#169; 2024 Alvin♥Paoi/Ethan Nguyen/Ekusos. All Rights Reserved
        </div>
    </footer>
  );
};

export default Footer;
