import React from 'react';
import Link from '../../components/Link/Link';
import styled from 'styled-components';
import List from '../../components/List/List';

const ProfileWrapper = styled.div`
    width: 50%;
    margin: 10px auto;
`;

const Avatar = styled.img`
    width: 150px;
`;

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {},
            repos: [],
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const user = this.props.user;
            const profile = await fetch(`https://api.github.com/users/${user}`);
            const profileJSON = await profile.json();

            if (profileJSON) {
                const repos = await fetch(profileJSON.repos_url);
                const reposArr = await repos.json();
                this.setState({
                    data: profileJSON,
                    repos: reposArr,
                    loading: false,
                    error: ''
                })
            }
        } catch(error) {
            this.setState({
                loading: false,
                error: error.message
            })
        }
    }

    render() {
        const { data, repos, loading, error } = this.state;

        if (loading || error) {
            return <div>{loading ? 'Loading ......' : error}</div>
        }

        const items = [
            { label: 'html_url', value: <Link url={data.html_url} title='Github URL' /> },
            { label: 'repos_url', value: data.repos_url },
            { label: 'name', value: data.name},
            { label: 'company', value: data.company ? data.company : 'NILL' },
            { label: 'location', value: data.location ? data.location : 'NILL' },
            { label: 'email', value: data.email ? data.email : 'NILL' },
            { label: 'bio', value: data.bio ? data.bio : 'NILL' }
        ]

        const projects = repos.map(repo => (
            {
                label: repo.name,
                value: <Link url={repo.html_url} title='GitHub URL' />
            }
        ))

        return (
            <ProfileWrapper>
                <Avatar className='Profile-avatar' src={data.avatar_url} alt='avatar' />
                <List title='Profile' items={items} />
                <List title='Projects' items={projects} />
            </ProfileWrapper>
        )
    }
}

export default Profile;