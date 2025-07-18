// Flash message middleware for session-based messaging

function flashMiddleware(req, res, next) {
  // Make flash messages available to templates
  res.locals.flash = {
    success: req.session.flashSuccess || null,
    error: req.session.flashError || null,
    info: req.session.flashInfo || null,
    warning: req.session.flashWarning || null
  };

  // Helper functions to set flash messages
  req.flash = {
    success: (message) => {
      req.session.flashSuccess = message;
    },
    error: (message) => {
      req.session.flashError = message;
    },
    info: (message) => {
      req.session.flashInfo = message;
    },
    warning: (message) => {
      req.session.flashWarning = message;
    }
  };

  // Clear flash messages after they're displayed (they only last one request)
  req.session.flashSuccess = null;
  req.session.flashError = null;
  req.session.flashInfo = null;
  req.session.flashWarning = null;

  next();
}

module.exports = { flashMiddleware };