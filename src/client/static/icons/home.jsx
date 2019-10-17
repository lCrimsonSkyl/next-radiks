/* eslint-disable */
import React from 'react';

const Home = ({
    style = {},
    color = '#FFFFFF',
    // width = '100%',
    className = '',
    height = '100%',
    viewBox = '0 0 196 156',
}) =>
    <svg
        // width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path fill={color} d="M168.051 89.855v58.363q0 3.162-2.31 5.472-2.31 2.31-5.472 2.31h-46.69v-46.691H82.452V156H35.761q-3.161 0-5.472-2.31-2.31-2.31-2.31-5.472V89.855q0-.122.061-.365t.061-.365l69.914-57.633 69.914 57.633q.122.244.122.73zm27.114-8.39l-7.538 8.998q-.973 1.094-2.553 1.337h-.365q-1.581 0-2.554-.851l-84.14-70.157-84.14 70.157q-1.459.973-2.918.851-1.581-.243-2.554-1.337L.865 81.465q-.973-1.216-.851-2.857.121-1.642 1.337-2.614L88.774 3.161Q92.665 0 98.015 0t9.241 3.161l29.668 24.805V4.256q0-1.703 1.094-2.797t2.797-1.094h23.345q1.702 0 2.797 1.094 1.094 1.094 1.094 2.797v49.608l26.628 22.13q1.216.972 1.338 2.614.121 1.641-.852 2.857z" />
    </svg>;

export default Home;