import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa6";
import './NavLink.css';

function NavLink({ icon, path, label, submenus }) {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const hasSubmenus = submenus && submenus.length > 0;

    // const isActive = path && location.pathname.startsWith(path);

    const handleClick = (e) => {
        if (hasSubmenus) {
            e.preventDefault();
            console.log(expanded)
            setExpanded(prev => !prev);
        }
    };

    return (
        <li className="nav-item">
            <div className="nav-tab" onClick={handleClick}>
                <div className="nav-icon">{icon}</div>
                <div className="nav-title">{label}</div>
                <div className="nav-dropdown"><FaChevronDown /></div>
            </div>
            {hasSubmenus && (
                <ul className={`dropdown-list ${expanded ? 'show' : ''}`}>
                    {submenus.map((submenu, idx) => (
                        <li key={idx}><Link to={submenu.path} className={`nav-link ${location.pathname === submenu.path ? 'active' : ''}`}>{submenu.label}</Link></li>
                    ))}
                </ul>
            )}
        </li>
    );
}

export default NavLink;
