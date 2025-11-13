// src/components/Nav.tsx (수정 및 정리된 버전)

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfoDto } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth();

    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    // 2. 주석 처리했던 useEffect 로직 활성화 및 정리
    useEffect(() => {
        const getData = async () => {
            // accessToken이 없으면 호출할 필요 없음
            if (!accessToken) {
                setData(null); // 로그아웃 상태면 데이터 초기화
                return;
            }

            try {
                const response = await getMyInfo();
                setData(response);
            } catch (error) {
                // 에러 발생 시 로그아웃 처리 등을 할 수 있으나, 일단 데이터만 초기화
                console.error('Failed to fetch user info:', error);
                setData(null);
            }
        };

        getData();

        // accessToken이 변경될 때만(로그인/로그아웃 시) 데이터를 다시 가져옴
        // 빈 배열 [] 대신 [accessToken]을 사용해야 안전하게 동작합니다.
    }, [accessToken]);

    // 1. handdleLogout 함수 정의를 해제하고 정리합니다.
    const handdleLogout = async (e: React.MouseEvent) => {
        e.preventDefault(); // Link의 기본 이동 동작을 먼저 막습니다.
        await logout();
        navigate('/');
    };

    // 2. data.data?.name 등 MyPage에서만 필요한 상태 관련 부분을 제거합니다.
    // Navbar에서는 간단히 '로그아웃' 버튼만 표시합니다.

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
            <div className="flex items-center justify-between p-4">
                <Link
                    to="/"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                >
                    Spinning Spinning Dolimpan
                </Link>

                <div className="space-x-6">
                    {/* 로그인/회원가입 */}
                    {!accessToken && (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            >
                                로그인
                            </Link>

                            <Link
                                to="/signup"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            >
                                회원가입
                            </Link>
                        </>
                    )}

                    {/* 로그인 시: 검색, 마이페이지, 로그아웃 */}
                    {accessToken && (
                        <Link
                            to="/search"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                            검색
                        </Link>
                    )}
                    {accessToken && (
                        <Link
                            to="/my"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                            {data?.data?.name}님 반갑습니다
                        </Link>
                    )}
                    {accessToken && (
                        <a // <a> 태그를 사용하거나, Link의 기본 동작을 막아야 합니다.
                            href="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            onClick={handdleLogout}
                        >
                            로그아웃
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
