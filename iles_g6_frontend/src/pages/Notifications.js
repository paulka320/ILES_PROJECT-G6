import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import API from '../api/axios'; 
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Pagination } from 'react-bootstrap';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/notifications/${user.id}/`);
      console.log("Notifications Data:", res.data);
      setNotifications(res.data);
      setFilteredNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setMessage({ type: 'danger', text: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.is_read);
    } else if (filter === 'read') {
      filtered = notifications.filter(n => n.is_read);
    }

    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [filter, notifications]);

  // Mark notifications as read
  const markAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/mark_read/`, { is_read: true });
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      setNotifications(updated);
      setMessage({ type: 'success', text: 'Notification marked as read' });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setMessage({ type: 'danger', text: 'Failed to update notifications' });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await API.post(`/notifications/${user.id}/mark_all_read/`);
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      setNotifications(updated);
      setMessage({ type: 'success', text: 'All notifications marked as read' });
    } catch (err) {
      console.error('Error marking all as read:', err);
      setMessage({ type: 'danger', text: 'Failed to update notifications' });
    }
  };

  // Delete notifications
  const deleteNotifications = async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}/`);
      const updated = notifications.filter(n => n.id !== notificationId);
      setNotifications(updated);
      setMessage({ type: 'success', text: 'Notification deleted' });
    } catch (err) {
      console.error('Error deleting notification:', err);
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
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'warning' : 'outline-warning'}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'success' : 'outline-success'}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            {loading ? (
              <Card.Body>
                <p className="text-center">Loading notifications...</p>
              </Card.Body>
            ) : filteredNotifications.length > 0 ? (
              <>
                <Table striped bordered hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNotifications.map((notification) => (
                      <tr key={notification.id} className={!notification.is_read ? 'table-active' : ''}>
                        <td className="text-center" style={{ fontSize: '1.2em' }}>
                          {getNotificationIcon(notification.notification_type)}
                        </td>
                        <td>
                          <div>
                            <strong>{notification.title || 'Notification'}</strong>
                            <p className="mb-0 text-muted">{notification.message}</p>
                          </div>
                        </td>
                        <td>{formatDate(notification.created_at)}</td>
                        <td className="text-center">
                          <Badge bg={notification.is_read ? 'success' : 'warning'}>
                            {notification.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </td>
                        <td>
                          {!notification.is_read && (
                            <Button
                              variant="info"
                              size="sm"
                              className="me-2"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteNotifications(notification.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {totalPages > 1 && (
                  <Card.Footer>
                    <Pagination className="mb-0">
                      <Pagination.First
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </Card.Footer>
                )}
              </>
            ) : (
              <Card.Body>
                <p className="text-center text-muted">No notifications to display</p>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;
