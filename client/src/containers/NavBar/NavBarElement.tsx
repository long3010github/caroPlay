import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #221322;
  height: 60px;
  margin-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  position: sticky;
  top: 0;
  z-index: 5;
`;

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  z-index: 1;
  padding: 0 24px;
  max-width: 1300px;
`;

export const NavLogo = styled(NavLink)`
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: bold;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin: 5px 5px;
  text-align: center;
  height: fit-content;
  max-width: fit-content;
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  padding: 5px 5%;
  width: 60%;

  @media screen and (max-width: 800px) {
    display: none;
  }
`;

export const NavMenuItem = styled.li`
  height: 40px;
  width: fit-content;
  padding: 5px;
  display: flex;
  align-items: center;
`;

export const NavMenuLink = styled(NavLink)`
  color: white;
  text-align: center;
  font-size: 20px;
  text-decoration: none;
  height: 100%;
  cursor: pointer;

  :hover {
    border-bottom: 2px solid #d88ec8;
  }
`;

export const NavMenuHamburger = styled.div`
  display: none;

  @media screen and (max-width: 700px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 25px;
    cursor: pointer;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  height: 100%;
  padding: 5px 10px;
`;

export const UserInfoLink = styled(NavLink)`
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  background: #91898f;
  border-radius: 50px;
  width: fit-content;
  height: 35px;
  padding: 5px 10px;

  :hover {
    transition: 0.2s ease-in-out;
    background: #ceb2c5;
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const UserAvatar = styled.img`
  height: 100%;
  width: 25px;
  border-radius: 50px;
  margin-right: 10px;
`;

export const UserInfo = styled.div`
  font-size: 20px;
  color: black;
`;

export const UserAccount = styled.div`
  width: 35px;
  height: 35px;
  background: #91898f;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;

  :hover {
    transition: 0.2s ease-in-out;
    background: #ceb2c5;
  }
`;

export const Dropdown = styled.img`
  width: 100%;
  height: 100%;
`;
