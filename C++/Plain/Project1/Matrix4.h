#include "vector4d.h"
#include <vector>
using namespace std;
class Matrix4
{
public:
	double matrix[4][4];
public:
	Matrix4() {};
	Matrix4(Matrix4& A);
	void operator=(Matrix4& A);
	void copy(Matrix4& A);
	void zeroMatrix();
	void identityMatrix();
	void diagonalMatrix(double value);
	void setElement(int row, int column, double value);
	Matrix4 operator+(Matrix4& A);
	void operator+=(Matrix4& A);
	Matrix4 operator-(Matrix4& A);
	void operator-=(Matrix4& A);
	Matrix4 operator*(Matrix4& A);
	void operator*=(Matrix4& A);
	Matrix4 operator*(double value);
	void operator*=(double value);
	Vector4D operator*(Vector4D &A);
	void transpose();
	double determinant();
	void adjungate();
	bool inverse();
	void scale(double sx, double sy, double sz);
	void translation(double sx, double sy, double sz);
	void rotateX(double fi);
	void rotateY(double fi);
	void rotateZ(double fi);
	Vector3D transform(Vector3D &A);
	vector<Vector3D> transform(vector<Vector3D> &vectors);
	inline double* Matrix4::operator[](int index)
	{
		return((double*)&matrix[index]);
	}
	Matrix4 rotateFree(Vector3D &p, Vector3D &v, double alpha);

};

