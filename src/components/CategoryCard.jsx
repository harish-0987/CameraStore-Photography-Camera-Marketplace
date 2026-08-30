import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '../styles/home.css';

const fallbackCatImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const CategoryCard = ({ category }) => {
  return (
    <Link to={category.path} className="category-card-item">
      <div className="category-card-bg">
        <img
          src={category.image || fallbackCatImg}
          alt={category.name}
          className="category-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackCatImg;
          }}
        />
        <div className="category-card-overlay" />
      </div>
      <div className="category-card-content">
        <span className="category-card-count">{category.count} Products</span>
        <h3 className="category-card-title">{category.name}</h3>
        <p className="category-card-desc">{category.description || category.desc}</p>
        <div className="category-card-action">
          <span>Explore Gear</span>
          <div className="arrow-circle">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
