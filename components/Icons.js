import React from 'react';
import { MaterialIcons, FontAwesome, Feather } from 'react-native-vector-icons';

export const Icons = {
    Home: (props) => <Feather name="home" size={props.size || 24} color={props.color || 'black'} />,
    Heart: (props) => <Feather name="heart" size={props.size || 24} color={props.color || 'black'} />,
    Grid: (props) => <Feather name="grid" size={props.size || 24} color={props.color || 'black'} />,
    PlusSquare: (props) => <Feather name="plus-square" size={props.size || 24} color={props.color || 'black'} />,
    User: (props) => <Feather name="user" size={props.size || 24} color={props.color || 'black'} />,
    Menu: (props) => <Feather name="menu" size={props.size || 24} color={props.color || 'black'} />,
    ArrowBack: (props) => <MaterialIcons name="arrow-back" size={props.size || 24} color={props.color || 'black'} />,
    Comment: (props) => <Feather name="message-circle" size={props.size || 24} color={props.color || 'black'} />,
    Edit: (props) => <Feather name="edit" size={props.size || 24} color={props.color || 'black'} />,
    Search: (props) => <Feather name="search" size={props.size || 24} color={props.color || 'black'} />,
    Logout: (props) => <MaterialIcons name="logout" size={props.size || 24} color={props.color || 'black'} />,
};
