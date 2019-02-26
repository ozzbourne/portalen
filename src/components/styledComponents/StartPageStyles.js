import styled from 'styled-components'

export const PageWrapp = styled.div`
    background-color: #2b2b2b;
    color: white;
`;
export const AppWrapp = styled.div`
    max-width: 960px;
    background: #3a3a3a;
    margin: 0 auto;
    min-height: 100vh;
`;

export const Apps = styled.div`
    margin-top: 120px;
    display: flex;
    border: 2px solid red;
    flex-wrap: wrap;
    > * {
        height: 220px;
        margin: 25px;
        width: calc(50% - 50px);
        background-color: blue;
        border: none;
        cursor: pointer;
    }
`;