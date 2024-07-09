import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import { getAuth, SegureRoute } from "../../utils";
import { useSocket } from "../../components/provider";
import "./styles.css";

export const Chat: React.FC<any> = () => {
  SegureRoute();
  const { token } = getAuth();
  const socket = useSocket();
  const [chats, setChats] = React.useState<{ uuid: string; name: string }[]>(
    []
  );

  const getChats = socket.channel("get/chats/all", {
    onSuccess: setChats,
    onError: console.error,
  });

  React.useEffect(() => {
    if (!socket || !getChats) return;
    getChats.on();
    getChats.emit(undefined, token);

    return () => {
      if (!socket || !getChats) return;
      getChats.off();
    };
  }, []);
  return (
    <Container fluid style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Row style={{ minHeight: "100vh" }}>
        <Col md={4} className="p-0" style={{ backgroundColor: "#3c3c3c" }}>
          <div
            className="header d-flex p-2 justify-content-between align-items-center"
            style={{ backgroundColor: "#2a2a2a" }}
          >
            <div className="header-user d-flex align-items-center">
              <Image
                style={{ width: 48 }}
                className="user-avatar"
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22171%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20171%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_190942e2666%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_190942e2666%22%3E%3Crect%20width%3D%22171%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2258%22%20y%3D%2294.5%22%3E171x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                roundedCircle
              />
              <span className="user-name" style={{ marginLeft: "0.5rem" }}>
                user name
              </span>
            </div>
            <div className="header-menu">...</div>
          </div>
          <ListGroup variant="flush" className="contacts mt-4">
            {/* <ListGroup.Item as="li" active>
              Cras justo odio
            </ListGroup.Item> */}
            {Array.isArray(chats) && chats.length
              ? chats.map(({ uuid, name }, key) => (
                  <Link
                    key={key}
                    className="list-group-item list-group-item-action border-bottom"
                    to={uuid}
                  >
                    {name}
                  </Link>
                ))
              : null}
          </ListGroup>
        </Col>
        <Col md={8} className="p-0">
          <div
            className="header d-flex p-2 justify-content-between align-items-center"
            style={{ backgroundColor: "#2a2a2a" }}
          >
            <h2>Mensajes</h2>
            <div className="header-menu">...</div>
          </div>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};
