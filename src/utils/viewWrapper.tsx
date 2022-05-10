import * as React from "react";
import * as Scrivito from "scrivito";
import throttle from "lodash-es/throttle";

function viewWrapper(WrappedComponent) {
  const ConnectedViewWrappedComponent = Scrivito.connect(WrappedComponent) as any;

  return class extends React.Component {
    state = {
      isSmallScreen: false,
      isMobile: false,
      isTablet: false,
      isSmMaxSize: false,
      isMediumSize: false,
      isLaptop: false,
      isDesktop: false,
    };

    updateDimensions = throttle(() => {
      let currWidth = window.outerWidth;

      if (Scrivito.isEditorLoggedIn() || !currWidth) {
        currWidth = window.innerWidth;
      }

      this.setState({
        isSmallScreen: currWidth <= 457,
        isMobile: currWidth <= 576,
        isTablet: currWidth <= 768,
        isSmMaxSize: currWidth <= 991,
        isMediumSize: currWidth <= 992,
        isLaptop: currWidth <= 1032,
        isDesktop: currWidth <= 1200,
      });
    }, 200);

    componentDidMount() {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
      const {
        isSmallScreen,
        isMobile,
        isTablet,
        isSmMaxSize,
        isMediumSize,
        isLaptop,
        isDesktop,
      } = this.state;

      return (
        <ConnectedViewWrappedComponent
          {...this.props}
          isSmallScreen={isSmallScreen}
          isMobile={isMobile}
          isTablet={isTablet}
          isSmMaxSize={isSmMaxSize}
          isMediumSize={isMediumSize}
          isLaptop={isLaptop}
          isDesktop={isDesktop}
        />
      );
    }
  };
}

export default viewWrapper;
