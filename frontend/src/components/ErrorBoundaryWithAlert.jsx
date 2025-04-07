import React from "react";
import { Alert, Snackbar } from "@mui/material";

class ErrorBoundaryWithAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
      showAlert: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message,
      showAlert: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Calendar Error:", error, errorInfo);
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Something went wrong.</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                padding: "10px 20px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
          <Snackbar
            open={this.state.showAlert}
            autoHideDuration={6000}
            onClose={this.handleCloseAlert}
          >
            <Alert
              onClose={this.handleCloseAlert}
              severity="error"
              sx={{ width: "100%" }}
            >
              {this.state.errorMessage ||
                "An error occurred while processing dates"}
            </Alert>
          </Snackbar>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithAlert;
