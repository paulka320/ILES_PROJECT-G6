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
  catch (err) { 
      console.error('Error marking all as read:', err);
      setMessage({ type: 'danger', text: 'Failed to update notifications' });
    }
  };

  // Delete notifications
  const deleteNotifications = async (notificaionsId) => {
    tyr {
      await API.delete('/notificaions/${notificaionId}/');
      const updated = notificaions.filter(n => n.id !== notificaionId);
      setNotificaions(updated);
      setMessage({ type: 'success', text: 'Notification deleted' });
    } catch (err) {
       console.error('Error deleting notificaion:', err);
       setMessage({ type: 'danger', text: 'Failed to delete notification' });
  }
};

// Pagination
const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
 const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

const getNotificationBadgeColor = (type) => {
        const colors = {
            'evaluation': 'info',
            'log_submission': 'primary',
            'evaluation_complete': 'success',
            'deadline': 'warning',
            'alert': 'danger',
            'general': 'secondary'
        };
        return colors[type] || 'secondary';
    };
      
    const getNotificationIcon = (type) => {
        const icons = {
            'evaluation': '📋',
            'log_submission': '📝',
            'evaluation_complete': '✅',
            'deadline': '⏰',
            'alert': '⚠️',
            'general': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    };      
  
  const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <Container fluid className="p-4">
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible className="mb-4">
                    {message.text}
                </Alert>
            )} 

 <Row className="mb-4">
                <Col>
                    <Card className="bg-primary text-white p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Notifications</h2>
                                <p>Unread: {unreadCount} | Total: {notifications.length}</p>
                            </div>
                            {unreadCount > 0 && (
                                <Button variant="light" onClick={markAllAsRead}>
                                    Mark All as Read
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

<Row className="mb-4">
                <Col>
                    <div className="btn-group" role="group">
                        <Button
                            variant={filter === 'all' ? 'primary': 'outline-primary'}
                            onClick={() => setFilter('all')}
                        >
                            All ({notifications.length})
                        </Button>
                        <Button
                            variant={filter === 'unread' ? 'warning': 'outline-warning'}
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </Button>
                        <Button
                            variant={filter === 'read' ? 'success': 'outline-success'}
                            onClick={() => setFilter('read')}
                        >
                            Read ({notifications.length - unreadCount})
                        </Button>
                    </div>
                </Col>
            </Row>

                                


                                      
      

    
      
  
  
  
