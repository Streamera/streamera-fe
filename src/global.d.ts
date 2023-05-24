import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?: MetaMaskInpageProvider
  }

  type ValueOf<T> = T[keyof T];
}