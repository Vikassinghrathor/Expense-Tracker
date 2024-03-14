import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/AuthReducer";
import Button from "react-bootstrap/Button";

export default function Logout() {
  const dispatch = useDispatch();

  const history = useHistory();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.replace("/");
  };

  return <Button onClick={logoutHandler}>Logout</Button>;
}