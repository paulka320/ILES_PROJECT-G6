import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import API from '../api/axios'; 
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Pagination } from 'react-bootstrap';

const Notifications = () => {
  const { user} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =10;
  
  
  
