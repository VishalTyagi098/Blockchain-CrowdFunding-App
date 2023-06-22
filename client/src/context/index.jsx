import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Connecting to our smart contract
  const { contract } = useContract(
    "0xF890B5BDA80dD3F0bC97cb174B34578Fb3dff20b"
  );

  // connecting to our metamask wallet
  const address = useAddress();
  const connect = useMetamask();

  // To use 'write' functions in smart contract
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  // FUNCTION 1: CREATING CAMPAIGN
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, //owner
        form.title, //title
        form.description, //description
        form.target, //ethereum
        new Date(form.deadline).getTime(), // deadline
        form.image,
      ]);

      console.log("Contract call successful", data);
    } catch (error) {
      console.log("Contract call failure", error);
    }
  };

  // Our state context provider has to return something, i.e., all of the functions to the frontend
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// To be able to use this context, we create our custom hook
export const useStateContext = () => useContext(StateContext);
