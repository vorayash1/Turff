import "./list.css"
import useSettings from "app/hooks/useSettings";
import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Layout1Sidenav from 'app/components/MatxLayout/Layout1/Layout1Sidenav';
import SidenavTheme from "app/components/MatxTheme/SidenavTheme/SidenavTheme";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "../turf.css";

function TeamList() {
    const { settings, updateSettings } = useSettings();
    const { layout1Settings } = settings;
    const theme = useTheme();
    const navigate = useNavigate();

    const {
        leftSidebar: { mode: sidenavMode, show: showSidenav }
    } = layout1Settings;
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        let { settings } = ref.current;
        let sidebarMode = settings.layout1Settings.leftSidebar.mode;
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? "close" : sidebarMode;
            updateSettings({ layout1Settings: { leftSidebar: { mode } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen]);

    const ref = useRef({ isMdScreen, settings });
    // const [data, setData] = useState();

    return (
        <>
            <div>
                <div className="container1">
                    {showSidenav && sidenavMode !== "close" && (
                        <SidenavTheme>
                            <Layout1Sidenav />
                        </SidenavTheme>
                    )}
                </div>
                <div className="container2">
                    <main b-bgeryw8qgq>
                        <div class="top-row px-4" b-bgeryw8qgq></div>
                        <article class="content px-4" b-bgeryw8qgq>
                            <h1 style={{ textAlign: "center" }}>Slot List</h1>
                            <br></br>
                            <div class="row mb-3">
                                <div class="col-md-12 text-center">
                                    <Button onClick={() => navigate("/auction/slot/addslot")} class="btn btn-sm btn-success mb-2" style={{ marginRight: "1vw" }}>
                                        Add Slot
                                    </Button>
                                    {/* <a style={{ marginRight: "1vw" }} href="/auction/team" class="btn btn-sm btn-success mb-2">
                                        Buy More Teams
                                    </a> */}
                                    <a href="/auction/myturff" class="btn btn-link">Back</a>
                                </div>
                                <div className="table-responsive">
                                    <table className="mat-elevation-z5 mdc-table">
                                        <thead>
                                            <tr class="mdc-table-header-row ">
                                                <th>Action</th>
                                                <th>Updated Slot Time Price</th>
                                                <th>Day of week</th>
                                                <th>UPdated Price</th>
                                                {/* <th>Number</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="mdc-table-row">
                                                <td className='auction-row'>
                                                    {/* <div class="tooltip-wrapper" b-zwztpb54d6>
                                                        <a href>
                                                            <button type="button" class="tooltips mdc-icon-button mdc-ripple-upgraded--unbounded mdc-ripple-upgraded" >
                                                                <i class="material-icons">delete</i>
                                                                <span class="tooltiptexts">Delete Slot</span>
                                                            </button>
                                                        </a>
                                                    </div> */}
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </article>
                    </main>
                </div>
            </div>
        </>
    )
}

export default TeamList;
