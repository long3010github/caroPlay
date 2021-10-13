import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Nav,
  NavbarContainer,
  NavLogo,
  UserSection,
  UserAvatar,
  UserInfo,
  UserInfoLink,
  UserInfoContainer,
  NavMenu,
  NavMenuItem,
  NavMenuLink,
  UserAccount,
  Dropdown,
} from './NavBarElement';
import avatar from '../../assets/profile.jpg';
import dropdown from '../../assets/dropdown.png';
import withCondition from '../../hoc/withCondition';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { RootState } from '../../store';
import { httpAdapter } from '../../adapter/http-request';
import { clearUser } from '../../store/auth/slice';
import { showWithComponent } from '../../store/Modal/slice';
import { ErrorModal } from '../../components/ErrorModal';

const NavBar = (): JSX.Element => {
  const { isAuth, userInfo } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const { data, error } = await httpAdapter.logout();
    if (error) {
      dispatch(showWithComponent(<ErrorModal errorMessage={error.message} />));
    }
    if (data) {
      if (data.success) dispatch(clearUser());
    }
  };

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">WeGomoku</NavLogo>
        {isAuth && (
          <>
            <NavMenu>
              <NavMenuItem>
                <NavMenuLink to="/">Home</NavMenuLink>
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuLink to="/leaderboard">Leaderboard</NavMenuLink>
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuLink to="/tournament">Tournament</NavMenuLink>
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuLink to="/about">About</NavMenuLink>
              </NavMenuItem>
            </NavMenu>
            <UserSection>
              <UserInfoLink to="/me">
                <UserInfoContainer>
                  <UserAvatar src={avatar} />
                  <UserInfo>{userInfo?.username}</UserInfo>
                </UserInfoContainer>
              </UserInfoLink>
              {/* this will be drop down later, now just make it a logout button */}
              <UserAccount>
                <Dropdown src={dropdown} onClick={handleLogout} />
              </UserAccount>
            </UserSection>
          </>
        )}
      </NavbarContainer>
    </Nav>
  );
};
export default NavBar;
