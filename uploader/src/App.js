import "./App.css";
import { Page, Layout, Card } from "@shopify/polaris";
import FileUploader from "./components/FileUploader";

function App() {
  return (
    <Page title="Uploader">
      <Layout>
        <Layout.Section>
          <Card>
            <FileUploader />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default App;
