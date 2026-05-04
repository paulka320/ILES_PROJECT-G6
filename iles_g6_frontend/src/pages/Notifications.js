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

  // fetch notifications from API
  const fetchNotifications = async () => {
    try{
      setLoading(true);
      const res = await API.get('/notofocations/${user.id}/');
      console.log("Notifications Data:", res.data);
      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } catch (err){
      console.error('Error fetching notifications:', err);
      setMessage({ type: 'danger', text: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications():
    }
  }, [user]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filtered === 'unread') {
      filtered = notifications.filter(n => !n.is_read);
    } else if (filter === 'read') {
      filtered = notifications.filter(n => n.is_read);
    }

    set FilteredNotifications(filtered);
    setCurrentPage(1);
  }, [filter, notifications]);

  // Mark notifications as read
  const markAsRead = async ( notificationId) => {
    try {
      await API.patch('/notifications/${notificationId}/mark_read/', { is_read: true });
      const update = notifications.map(n=>
        n.id === notificationId? { ...n, is_read: true } : n
     ); 
      setNotificaions(updated);
      setMessage({ types: 'success', text: 'Notification marked as read' });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setMessage({ type: 'danger', text: 'Failed to update notifications' });
    }
  }:

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try{
      await API.post('/notificaions/${user.id}/mark_all_read/');
      const updated = notifications.map(n => ({...n, is_read: true }));
      setNotifications(updated);
      setMessage({ type: 'success', text: 'All notifications marked as read' });
      
  
      
                                


                                      
      

    
      
  
  
  
