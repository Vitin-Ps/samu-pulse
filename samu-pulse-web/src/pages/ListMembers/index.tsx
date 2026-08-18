import { ListMembersView } from "./ListMembersView";
import { useListMembersModel } from "./useListMembersModel";


export const ListMembersPage = () => {
  const model = useListMembersModel();
  return <ListMembersView {...model} />;
};
