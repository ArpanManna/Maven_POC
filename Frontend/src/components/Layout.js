import { useEffect } from "react";
import Nav from "./Nav";
import { useWeb3 } from "@3rdweb/hooks";
import { getUserDetails } from "@/utils/service";
import { useContextState } from "@/context";

 export default function Layout({ children }) {
    const {chainId, provider, address} = useWeb3();
    const [{}, dispatch] = useContextState();


    useEffect(() => {
        if (address) getCurrentUserDetails();
    },[address]);

    const getCurrentUserDetails = async () => {
        await getUserDetails(chainId, provider, address, dispatch);
    } 

  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}