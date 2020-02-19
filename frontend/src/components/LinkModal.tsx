import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { ConfigGlobal, ConfigGlobalLoader } from "../config/config";
import PlaidLink from "react-plaid-link";
import usePlaid from "../hooks/usePlaid";

const configGlobal: ConfigGlobal = ConfigGlobalLoader.config;

function LinkModal({ modalVisible, handleToggleModal }: any) {
  const {
    // @ts-ignore
    handleSuccess,
    handleExit
  }: any = usePlaid();

  const Link = () => {
    // settings product to liabilities will show student loan options instead of banks
    const products: any = [
      "auth",
      "transactions",
      "identity",
      "liabilities",
      "assets",
      "investments",
      "income"
    ];
    return (
      <PlaidLink
        clientName={"demo"}
        env={configGlobal.PLAID_ENV}
        product={products}
        publicKey={configGlobal.PLAID_PUBLIC_KEY}
        onExit={handleExit}
        onSuccess={handleSuccess}
      >
        <div style={{ margin: 50 }}>
          <h2>You need to link your account in order to create an entry!</h2>
          <h3>This step is securely handled by Plaid (acquired by Visa)</h3>
          <Button>Link your account now</Button>
        </div>
      </PlaidLink>
    );
  };

  return (
    <Dialog open={modalVisible} onClose={handleToggleModal}>
      <Link />
    </Dialog>
  );
}

export default LinkModal;
