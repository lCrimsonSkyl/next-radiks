import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Button from './Button';

function CreatePost(props) {
    const { classes } = props;

    let textArea;

    const post = () => {
        textArea.value = '';
    };

    return (
        <div className={classes.container}>
            <div>
                <b style={{ marginLeft: 10 }}>
                    Create a Posts
                </b>
            </div>
            <div>
                <textarea
                    ref={(node) => {
                        textArea = node;
                    }}
                    placeholder="What's on your mind?"
                />
                <span>
                    <Button label="Post" onClick={post} />
                </span>
            </div>
        </div>
    )
}

const styles = () => ({
    container: {
        width: '100%',
        borderRadius: 5,
        border: '.5px solid #14599180',
        '-webkit-box-shadow': '0px 0px 4px 1px rgba(0,0,0,0.20)',
        '-moz-box-shadow': '0px 0px 4px 1px rgba(0,0,0,0.20)',
        boxShadow: '0px 0px 4px 1px rgba(0,0,0,0.20)',
        '& div:nth-child(1)': {
            width: '100%',
            backgroundColor: '#F3F6F8',
            fontSize: '14px',
            padding: '5px 0px',
            borderRadius: '5px 5px 0px 0px',
            borderRight: '1px solid #14599180',
            borderBottom: '1px solid #14599180',
            borderLeft: '1px solid #14599180',
        },
        '& div:nth-child(2)': {
            width: '100%',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 0px',
            borderRadius: '0px 0px 5px 5px',
            borderRight: '1px solid #14599180',
            borderBottom: '1px solid #14599180',
            borderLeft: '1px solid #14599180',
            '& textarea': {
                fontSize: 20,
                width: '96%',
                height: 70,
                border: 'none',
                overflow: 'auto',
                outline: 'none',
                '-webkit-box-shadow': 'none',
                '-moz-box-shadow': 'none',
                boxShadow: 'none',
                resize: 'none',
                '&:focus ~ span': {
                    height: '38px',
                    transition: '.4s ease-in all',
                },
            },
            '& span': {
                alignSelf: 'flex-end',
                marginRight: 12,
                marginTop: 10,
                overflow: 'hidden',
                height: '0px',
                transition: '.4s ease-in all',
            },
            '&:hover span': {
                height: '38px',
                transition: '.4s ease-in all',
            },
        },
    },
});

CreatePost.propTypes = {
    classes: PropTypes.object,
}

export default withStyles(styles)(CreatePost);
