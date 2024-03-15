const roles = {
    // Grant access based on the grid:
    businessOwner: {
      restaurantListing: {
        create: true,
        read: true,
        update: true,
        delete: false
      }
    },
    user: {
      restaurantListing: {
        create: false,
        read: true,
        update: false,
        delete: false
      }
    },
    admin: {
      restaurantListing: {
        create: true,
        read: true,
        update: true,
        delete: true
      }
    }
  };
  
  const authorize = (operation, resource) => { // Include operation and resource parameters
    return (req, res, next) => {
      const userRole = req.user.role; // Get user role from request object
  
      if (!roles[userRole] || !roles[userRole][resource][operation]) {
        return res.status(403).send({ error: 'Forbidden. Unauthorized access' });
      }
  
      next();
    };
  };
  
  module.exports = authorize;
  