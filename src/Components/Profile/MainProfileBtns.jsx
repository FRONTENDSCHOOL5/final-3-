import { Link } from 'react-router-dom';
import styled from 'styled-components';
import iconChat from '../../assets/icons/chat.png';
import iconShare from '../../assets/icons/share.png';
import Button from '../Common/Button';
import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';
import { setToken } from '../../Atom/atom';
import { setIsFollowed } from '../../Atom/atom';
import axios from 'axios';

export default function MainProfileBtns({ accountName, isMyProfile, setFollowerCount, followerCount }) {
  const [isSubscribed, setIsSubscribed] = useRecoilState(setIsFollowed);
  //   const [followerCount, setFollowerCount] = useState(2890);
  const token = useRecoilValue(setToken);
  const URL = 'https://api.mandarin.weniv.co.kr';

  console.log(followerCount);

  async function handleClick() {
    if (isSubscribed === false) {
      setIsSubscribed(true);
      console.log(isSubscribed);
      //   팔로워 추가해주기 -> api 요청
      const reqPath = `/profile/${accountName}/follow`;
      try {
        const response = await axios(URL + reqPath, {
          method: 'post',
          headers: {
            // 프로필 정보 요청 (토큰 필요)
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        });
        setFollowerCount(response.data.profile.followerCount);
      } catch (error) {
        console.log(error);
      }
    } else if (isSubscribed) {
      setIsSubscribed(false);
      //   팔로워 제거해주기 -> api 요청
      const reqPath = `/profile/${accountName}/unfollow`;
      try {
        const response = await axios(URL + reqPath, {
          method: 'DELETE',
          headers: {
            // 프로필 정보 요청 (토큰 필요)
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        });
        setFollowerCount(response.data.profile.followerCount);

        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (isMyProfile) {
    return (
      <SBtnLayout>
        <Button width="120px" myProfileBtn={true}>
          <Link to="/profile">프로필 수정</Link>
        </Button>
        <Button width="100px" myProfileBtn={true}>
          <Link to="/product">상품 등록</Link>
        </Button>
      </SBtnLayout>
    );
  } else if (!isMyProfile) {
    return (
      <SBtnContainer>
        <SChatBtn />
        <Button width="120px" onClick={handleClick} subscribed={isSubscribed}>
          {isSubscribed ? '언팔로우 ' : '팔로우'}
        </Button>
        <SShareBtn />
      </SBtnContainer>
    );
  }
}

const SBtnLayout = styled.div`
  box-shadow: inset 0 0 20px red;
  text-align: center;

  button:first-child {
    margin-right: 12px;
  }
`;

const SBtnContainer = styled.div`
  box-shadow: inset 0 0 20px red;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;

const SChatBtn = styled.button`
  background: url(${iconChat}) no-repeat center/ 15px 15px;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border-gray);
  border-radius: 50%;
`;

const SShareBtn = styled(SChatBtn)`
  background: url(${iconShare}) no-repeat center/ 20px 20px;
`;
