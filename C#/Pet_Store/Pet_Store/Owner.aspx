<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Owner.aspx.cs" Inherits="Pet_Store.Owner" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="CSS.css" rel="stylesheet" />
    <title>Owner</title>
</head>
<body>
    <form id="form1" runat="server">
    <div class="content">
          <ul>
                <li><a href="Default.aspx">HOME</a></li>
                <li><a href="Store.aspx">STORE</a></li>
                <li><a href="Owner.aspx">OWNER</a></li>
                <li><a href="Dog.aspx">PET</a></li>
          </ul>
                <div class="page">

        <table class="tabela" style="font-size:26px;">
            <tr>
                <td><asp:Label Text="First Name:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="fname" Width="170px" Font-Size="20px" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Label Text="Last name:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="lname" Width="170px" Font-Size="20px" runat="server" ></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Label Text="Address:" runat="server"></asp:Label></td>
                <td><asp:TextBox ID="address" Width="170px" Font-Size="20px" runat="server" ></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Button ID="dodaj" runat="server" Text="Add owner" OnClick="dodaj_Click"/></td>
                <td><asp:Label ID="error" class="greska" runat="server"></asp:Label></td>
            </tr>
              <tr>
                <td><asp:Label Text="Owner name:" runat="server"></asp:Label></td>
                 <td><asp:DropDownList Width="170px" Font-Size="20px" ID="izborVlasnika" AutoPostBack="true" OnSelectedIndexChanged="ownerPets_Load" OnDataBound="ownerPets_Load" runat="server" DataSourceID="LinqDataSource2" DataTextField="fname" DataValueField="owner_id"></asp:DropDownList>
                <asp:LinqDataSource ID="LinqDataSource2" runat="server" ContextTypeName="Pet_Store.DataClasses1DataContext" EntityTypeName="" TableName="owners"></asp:LinqDataSource></td>
             </tr>
            <tr>
                <td><asp:Label   Text="Selected owner's pets:" runat="server"></asp:Label></td>
                <td><asp:TextBox  ReadOnly="true" ID="ownerPets" runat="server" Height="40px" TextMode="MultiLine" ></asp:TextBox></td>
           
            </tr>
            <tr>
                <td colspan="2"><asp:Button ID="obrisi" runat="server" Text="Remove owner and all his pets" OnClick="obrisi_Click" Width="200px" /></td>
                
           
            </tr>
        </table>
      </div>
    </div>
    </form>
</body>
</html>
