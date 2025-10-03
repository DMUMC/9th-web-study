import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("메시지가 성공적으로 전송되었습니다!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="page-container">
      <div className="contact-section">
        <h1>📞 연락처</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>문의하기</h2>
            <p>Duck SPA에 대한 문의사항이 있으시면 언제든지 연락해주세요!</p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h3>이메일</h3>
                  <p>duck@example.com</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <h3>전화</h3>
                  <p>010-1234-5678</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">🌐</div>
                <div className="contact-details">
                  <h3>웹사이트</h3>
                  <p>www.duckspa.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2>메시지 보내기</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">메시지</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                메시지 전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
