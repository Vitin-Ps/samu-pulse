import {AddMemberView} from './AddMemberView';
import {useAddMemberModel} from './useAddMemberModel';

export const AddMemberPage = () => {
  const model = useAddMemberModel({});
  return <AddMemberView {...model} />;
};
