import { HelmetProvider, Helmet } from "react-helmet-async";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 */
function PageMeta({ title, description }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
        </Helmet>
    );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
function AppWrapper({ children }) {
    return (
        <HelmetProvider>{children}</HelmetProvider>
    );
}

export { AppWrapper };
export default PageMeta;
